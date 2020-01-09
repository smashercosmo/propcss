# TODO
+ Support for simple expressions
```jsx
    <Box m={expression ? 10 : 16} />
```
+ Support for both numeric and string values
```jsx
    <Box m={16} w="100vw" />
```
+ Integration with tailwindcss
+ Cleaning up unused styles in dev mode? (not an issue for prod builds)
+ Using virtual modules instead of writing to disk
+ Responsive styles 
 ```jsx
     <Box m={[16, 32, 64]} />
 ```
+ Source maps. With current implementation source maps don't make sense, because styles from different files are aggregated and deduplicated. Maybe it makes sense to not deduplicate styles in dev mode.
+ Better name for the package 