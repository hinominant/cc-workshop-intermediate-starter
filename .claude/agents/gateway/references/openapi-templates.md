# OpenAPI Templates

## Minimal OpenAPI 3.0 Template

```yaml
openapi: '3.0.3'
info:
  title: API Name
  version: '1.0.0'
  description: API description
servers:
  - url: https://api.example.com/v1
paths:
  /resources:
    get:
      summary: List resources
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceList'
components:
  parameters:
    PageParam:
      name: page
      in: query
      schema: { type: integer, default: 1 }
    LimitParam:
      name: limit
      in: query
      schema: { type: integer, default: 20, maximum: 100 }
  schemas:
    ResourceList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/Resource' }
        pagination:
          $ref: '#/components/schemas/Pagination'
```

## Error Response (RFC 7807)

```yaml
ErrorResponse:
  type: object
  properties:
    type: { type: string, format: uri }
    title: { type: string }
    status: { type: integer }
    detail: { type: string }
    instance: { type: string, format: uri }
```
