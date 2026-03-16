# Reel CI/CD Integration

Automated terminal recording workflows using VHS in CI pipelines.

---

## GitHub Actions: VHS Recording Workflow

### Using charmbracelet/vhs-action

```yaml
# .github/workflows/record-demos.yml
name: Record Terminal Demos

on:
  push:
    branches: [main]
    paths:
      - 'src/cli/**'
      - '*.tape'
      - '.github/workflows/record-demos.yml'
  pull_request:
    paths:
      - 'src/cli/**'
      - '*.tape'

jobs:
  record:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Cache VHS binary
        uses: actions/cache@v4
        with:
          path: /usr/local/bin/vhs
          key: vhs-${{ runner.os }}-${{ hashFiles('.vhs-version') }}

      - name: Install VHS
        uses: charmbracelet/vhs-action@v2
        with:
          install-only: true

      - name: Record all tape files
        run: |
          for tape in demos/*.tape; do
            echo "Recording $tape..."
            vhs "$tape"
          done

      - name: Upload recordings
        uses: actions/upload-artifact@v4
        with:
          name: terminal-recordings
          path: |
            demos/*.gif
            demos/*.mp4
          retention-days: 30
```

### Manual VHS Installation

```yaml
      - name: Install VHS (manual)
        run: |
          VHS_VERSION="${{ env.VHS_VERSION || '0.8.0' }}"
          curl -fsSL "https://github.com/charmbracelet/vhs/releases/download/v${VHS_VERSION}/vhs_${VHS_VERSION}_linux_amd64.tar.gz" \
            | tar xz -C /usr/local/bin vhs
          vhs --version

      - name: Install recording dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y ffmpeg ttyd
```

---

## PR Preview Comments

Post recording previews as PR comments so reviewers can see CLI output changes.

```yaml
  preview:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    needs: record
    permissions:
      pull-requests: write
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: terminal-recordings
          path: recordings/

      - name: Upload GIFs to temporary hosting
        id: upload
        run: |
          urls=""
          for gif in recordings/*.gif; do
            filename=$(basename "$gif")
            # Upload to repository wiki or external hosting
            # Using GitHub's own CDN via issue attachment API
            url=$(gh api repos/${{ github.repository }}/issues/${{ github.event.pull_request.number }}/comments \
              --field body="![${filename}](${gif})" 2>/dev/null || echo "")
            urls="${urls}\n- ${filename}"
          done
          echo "file_list<<EOF" >> "$GITHUB_OUTPUT"
          echo -e "$urls" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"

      - name: Comment PR with recordings
        uses: peter-evans/create-or-update-comment@v4
        with:
          issue-number: ${{ github.event.pull_request.number }}
          body: |
            ## Terminal Recording Preview

            Updated recordings from this PR:

            | Demo | Recording |
            |------|-----------|
            | help | ![help](../recordings/help.gif) |
            | init | ![init](../recordings/init.gif) |

            > Recorded with [VHS](https://github.com/charmbracelet/vhs) via Reel agent
          comment-tag: terminal-recordings
```

### Before/After Comparison

```yaml
      - name: Download base branch recordings
        run: |
          git fetch origin ${{ github.base_ref }}
          git checkout origin/${{ github.base_ref }} -- docs/recordings/ 2>/dev/null || true
          mv docs/recordings/ base-recordings/ 2>/dev/null || mkdir -p base-recordings/

      - name: Build comparison comment
        id: compare
        run: |
          body="## CLI Output Comparison\n\n"
          for gif in recordings/*.gif; do
            name=$(basename "$gif")
            if [ -f "base-recordings/$name" ]; then
              body+="### ${name}\n| Before | After |\n|--------|-------|\n"
              body+="| ![before](base-recordings/${name}) | ![after](recordings/${name}) |\n\n"
            else
              body+="### ${name} (new)\n![new](recordings/${name})\n\n"
            fi
          done
          echo "body<<EOF" >> "$GITHUB_OUTPUT"
          echo -e "$body" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
```

---

## Automated Demo Updates

Auto-commit updated GIFs when CLI source changes on the main branch.

```yaml
  update-docs:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: record
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/download-artifact@v4
        with:
          name: terminal-recordings
          path: docs/recordings/

      - name: Commit updated recordings
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/recordings/
          if git diff --cached --quiet; then
            echo "No recording changes to commit"
          else
            git commit -m "docs: update terminal recordings"
            git push
          fi
```

### Git LFS for Large GIFs

```bash
# .gitattributes
docs/recordings/*.gif filter=lfs diff=lfs merge=lfs -text
docs/recordings/*.mp4 filter=lfs diff=lfs merge=lfs -text
```

```yaml
      - name: Setup Git LFS
        run: |
          git lfs install
          git lfs track "docs/recordings/*.gif"
          git lfs track "docs/recordings/*.mp4"
```

---

## Caching Strategies

### VHS Binary Cache

```yaml
      - name: Cache VHS binary
        id: cache-vhs
        uses: actions/cache@v4
        with:
          path: |
            /usr/local/bin/vhs
            ~/.local/share/vhs/
          key: vhs-${{ runner.os }}-v0.8.0

      - name: Install VHS
        if: steps.cache-vhs.outputs.cache-hit != 'true'
        run: |
          curl -fsSL "https://github.com/charmbracelet/vhs/releases/download/v0.8.0/vhs_0.8.0_linux_amd64.tar.gz" \
            | tar xz -C /usr/local/bin vhs
```

### Font Cache

```yaml
      - name: Cache fonts
        uses: actions/cache@v4
        with:
          path: ~/.local/share/fonts
          key: fonts-${{ runner.os }}-${{ hashFiles('fonts.txt') }}

      - name: Install fonts
        if: steps.cache-fonts.outputs.cache-hit != 'true'
        run: |
          mkdir -p ~/.local/share/fonts
          curl -fsSL -o JetBrainsMono.zip \
            "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip"
          unzip -o JetBrainsMono.zip -d ~/.local/share/fonts/
          fc-cache -fv
```

### Hash-Based Output Cache

Skip re-recording when neither the tape file nor the CLI binary has changed.

```yaml
      - name: Compute source hash
        id: source-hash
        run: |
          hash=$(cat demos/*.tape src/cli/**/*.ts | sha256sum | cut -d' ' -f1)
          echo "hash=$hash" >> "$GITHUB_OUTPUT"

      - name: Cache recordings
        id: cache-recordings
        uses: actions/cache@v4
        with:
          path: docs/recordings/
          key: recordings-${{ steps.source-hash.outputs.hash }}

      - name: Record demos
        if: steps.cache-recordings.outputs.cache-hit != 'true'
        run: |
          for tape in demos/*.tape; do
            vhs "$tape"
          done
```

---

## Matrix Recording

Record demos across different shells and themes for comprehensive documentation.

```yaml
  matrix-record:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shell: [bash, zsh, fish]
        theme: [light, dark]
    steps:
      - uses: actions/checkout@v4

      - name: Install shells
        run: |
          sudo apt-get update
          sudo apt-get install -y ${{ matrix.shell }}

      - name: Install VHS
        uses: charmbracelet/vhs-action@v2
        with:
          install-only: true

      - name: Prepare tape with shell and theme
        run: |
          for tape in demos/*.tape; do
            name=$(basename "$tape" .tape)
            output="demos/output/${name}-${{ matrix.shell }}-${{ matrix.theme }}.gif"
            sed \
              -e "s|^Set Shell .*|Set Shell \"${{ matrix.shell }}\"|" \
              -e "s|^Set Theme .*|Set Theme \"${{ matrix.theme == 'light' && 'OneHalfLight' || 'Dracula' }}\"|" \
              -e "s|^Output .*|Output ${output}|" \
              "$tape" > "${tape%.tape}-${{ matrix.shell }}-${{ matrix.theme }}.tape"
          done

      - name: Record
        run: |
          mkdir -p demos/output
          for tape in demos/*-${{ matrix.shell }}-${{ matrix.theme }}.tape; do
            vhs "$tape"
          done

      - name: Upload matrix recordings
        uses: actions/upload-artifact@v4
        with:
          name: recordings-${{ matrix.shell }}-${{ matrix.theme }}
          path: demos/output/
```

---

## Complete Example Workflow

A production-ready workflow combining all strategies.

```yaml
# .github/workflows/record-demos.yml
name: Record Terminal Demos

on:
  push:
    branches: [main]
    paths: ['src/cli/**', 'demos/**/*.tape']
  pull_request:
    paths: ['src/cli/**', 'demos/**/*.tape']

env:
  VHS_VERSION: '0.8.0'

jobs:
  record:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true

      # --- Caching ---
      - name: Cache VHS
        id: cache-vhs
        uses: actions/cache@v4
        with:
          path: /usr/local/bin/vhs
          key: vhs-${{ runner.os }}-${{ env.VHS_VERSION }}

      - name: Cache fonts
        id: cache-fonts
        uses: actions/cache@v4
        with:
          path: ~/.local/share/fonts
          key: fonts-${{ runner.os }}-jetbrains-mono-v2.304

      - name: Compute source hash
        id: src-hash
        run: |
          hash=$(cat demos/*.tape src/cli/**/* 2>/dev/null | sha256sum | cut -d' ' -f1)
          echo "hash=$hash" >> "$GITHUB_OUTPUT"

      - name: Cache recordings
        id: cache-rec
        uses: actions/cache@v4
        with:
          path: docs/recordings/
          key: recordings-${{ steps.src-hash.outputs.hash }}

      # --- Install ---
      - name: Install VHS
        if: steps.cache-vhs.outputs.cache-hit != 'true'
        run: |
          curl -fsSL "https://github.com/charmbracelet/vhs/releases/download/v${VHS_VERSION}/vhs_${VHS_VERSION}_linux_amd64.tar.gz" \
            | tar xz -C /usr/local/bin vhs

      - name: Install fonts
        if: steps.cache-fonts.outputs.cache-hit != 'true'
        run: |
          mkdir -p ~/.local/share/fonts
          curl -fsSL -o /tmp/JBMono.zip \
            "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip"
          unzip -o /tmp/JBMono.zip -d ~/.local/share/fonts/
          fc-cache -fv

      - name: Install dependencies
        run: sudo apt-get update && sudo apt-get install -y ffmpeg

      # --- Record ---
      - name: Record demos
        if: steps.cache-rec.outputs.cache-hit != 'true'
        run: |
          mkdir -p docs/recordings
          for tape in demos/*.tape; do
            echo "::group::Recording $(basename $tape)"
            vhs "$tape" -o "docs/recordings/$(basename ${tape%.tape}).gif"
            echo "::endgroup::"
          done

      # --- PR Preview ---
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: peter-evans/create-or-update-comment@v4
        with:
          issue-number: ${{ github.event.pull_request.number }}
          comment-tag: reel-recordings
          body: |
            ## Terminal Recording Preview
            Recordings updated from changes in this PR.
            Download the full set: [Artifacts](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})

      # --- Auto-commit on main ---
      - name: Commit updated recordings
        if: github.ref == 'refs/heads/main' && steps.cache-rec.outputs.cache-hit != 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/recordings/
          if ! git diff --cached --quiet; then
            git commit -m "docs: update terminal recordings [skip ci]"
            git push
          fi
```
