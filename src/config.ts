const config = {
  dir: '/mock',
  pattern: '/',
  fileSuffix: false,
  delay: [0, 100]
}

export type MockConfig = {
  dir?: string
  pattern?: string
  delay?: [number, number]
}

export default config