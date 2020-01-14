import { traverse } from '../traverse'
import { attributes } from '../attributes'

it('transforms correctly', () => {
  const jsx = `
    function Test() {
      return (
        <Box
          mt={14}
          mb="28px"
          ml="2%"
          mr={-14}
          pt={100}
          className={['class1', 'class2'].join(' ')}>
          test
        </Box>
      )
    }
  `

  const result = traverse(jsx, 'test.tsx', { attributes, component: 'Box' })
  expect((result || {}).code).toMatchSnapshot()
})
