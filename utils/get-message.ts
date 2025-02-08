import { parse } from '@std/yaml'

const getMessage = (key: string): string => {
  const path = '/app/messages.yml'
  const yaml = Deno.readTextFileSync(path)
  const dict = parse(yaml) as Record<string, Record<string, string>>
  const lang = Deno.env.get('LANG') ?? 'en-us'
  return dict[lang][key] ?? `messages[${lang}][${key}] does not exist`
}

export default getMessage
