import { Alert, Loader } from '@mantine/core';
import { useParams } from 'react-router-dom';
import UpdateCounter from '../components/UpdateCounter';
import { useGetCounterQuery } from '../utils/__generated__/graphql';

const EditCounter = () => {
  const { counterId } = useParams();
  const { data, loading } = useGetCounterQuery({
    variables: { id: parseInt(counterId || '') },
  });
  const counter = data?.counters_by_pk;
  if (loading) {
    return <Loader />;
  }

  if (!counter) {
    return <Alert>404 - counter not found</Alert>;
  }

  return <UpdateCounter counter={counter} />;
};

export default EditCounter;
