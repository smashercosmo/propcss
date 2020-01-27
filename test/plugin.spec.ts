import { traverse } from '../src/traverse'
import {
  CSSPropToClassNameMapping,
  componentPropToCSSPropMapping,
} from '../src/attributes'

it('transforms correctly', () => {
  const jsx = `
    function Test() {
      return (
        <div>
          <div
            mt="14em"
            mb="28px"
            ml="2%"
            mr={-14}
            pt={100}
            pl="0px"
            paddingBottom={200}
            className={['class1', 'class2'].join(' ')}>
            should create atomic classes
          </div>
          <CustomComponent pt={100} paddingBottom={200} className="foo bar">
            should create atomic classes
          </CustomComponent>
          <IgnoredComponent pt={100} paddingBottom={200}>
            should not create atomic classes
          </IgnoredComponent>  
        </div>
      )
    }
  `

  const result = traverse(jsx, 'test.tsx', {
    CSSPropToClassNameMapping,
    componentPropToCSSPropMapping,
    components: ['div', 'CustomComponent'],
  })
  expect((result || {}).code).toMatchSnapshot()
})
