// deno-lint-ignore no-explicit-any
const readableStreamToString = async (stream: ReadableStream<any>): Promise<string> => {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let result = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value, { stream: true })
  }

  result += decoder.decode()
  return result
}

export default readableStreamToString
