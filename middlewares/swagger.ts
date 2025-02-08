import { Router, Status } from '@oak/oak'
import getPrefix from '../utils/get-prefix.ts'

const prefix = getPrefix('docs')
const router = new Router({
  methods: ['GET'],
  prefix
})

router.get('/', (ctx) => {
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.min.js"></script>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script>
          window.onload = () => {
            window.SwaggerUIBundle({
              url: '${prefix}/openapi.yml',
              dom_id: '#swagger-ui'
            })
          }
        </script>
      </body>
    </html>
  `
  ctx.response.type = 'text/html'
})

// Serve the OpenAPI YAML file
router.get('/openapi.yml', async (ctx) => {
  try {
    ctx.response.body = await Deno.readTextFile(`${import.meta.dirname}/../docs/bundle.yml`)
    ctx.response.type = 'application/yaml'
  } catch (err) {
    console.error('Error serving OpenAPI file:', err)
    ctx.response.status = Status.InternalServerError
  }
})

export default router
