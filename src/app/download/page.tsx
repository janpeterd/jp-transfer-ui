import { getTransferByLinkUuid } from '@/api/transfer';
import TransferInfo from '@/components/TransferInfo';
import { useQuery } from '@tanstack/react-query';

export default function Download({
  linkUuid
}: {
  linkUuid: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['download', linkUuid],
    queryFn: async () => getTransferByLinkUuid(linkUuid),
  })

  return (
    <div className='w-full max-w-screen-md md:-mt-4'>
      {data?.data && (
        <div className='w-full'>
          <TransferInfo transfer={data.data} />
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  )
}
