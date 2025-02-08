// deno-lint-ignore no-explicit-any
const stringToReadableStream = (orig: string): ReadableStream<any> => {
  return new ReadableStream({
    start (controller) {
      controller.enqueue(new TextEncoder().encode(orig))
      controller.close()
    }
  })
}

export default stringToReadableStream
