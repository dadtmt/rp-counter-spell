import { Center, Loader } from '@mantine/core';

const CenteredLoader = () => (
  <Center style={{ width: '100%', height: '100%' }}>
    <Loader />
  </Center>
);

export default CenteredLoader;
