import readableStreamToString from './string.ts'

const readableStreamToObject = async (stream: ReadableStream): Promise<object> => {
  const str = await readableStreamToString(stream)
  return JSON.parse(str)
}

export default readableStreamToObject
