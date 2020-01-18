import { traverse } from '../src/traverse'
import {
  CSSPropToClassNameMapping,
  componentPropToCSSPropMapping,
} from '../src/attributes'

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
          paddingBottom={200}
          className={['class1', 'class2'].join(' ')}>
          test
        </Box>
      )
    }
  `

  const result = traverse(jsx, 'test.tsx', {
    CSSPropToClassNameMapping,
    componentPropToCSSPropMapping,
    component: 'Box',
  })
  expect((result || {}).code).toMatchSnapshot()
})
