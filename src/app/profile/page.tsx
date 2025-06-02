import { getStorageInfo, getUserStorageInfo } from '@/api/storage';
import { getUserTransfers } from '@/api/transfer';
import ChangePasswordForm from '@/components/changePassword';
import ProfileStat from '@/components/ProfileStat';
import TransferColumns from '@/components/table/transfer-columns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { formatSize } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userProfileTransfers'],
    queryFn: async () => getUserTransfers(),
  });
  const { user } = useAuth();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

  const { data: storageData, isLoading: isLoadingStorage } = useQuery({
    queryKey: ['systemStorageInfoProfile'],
    queryFn: async () => getStorageInfo(),
  });

  const { data: userStorageData, isLoading: isLoadingUserStorage } = useQuery({
    queryKey: ['userStorageInfoProfile'],
    queryFn: async () => getUserStorageInfo(),
  });
  console.log("userStorageData", userStorageData)

  if (isLoading || isLoadingStorage || isLoadingUserStorage) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center text-neutral-400 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-neutral-100 space-y-10">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-700/80">
          <div>
            <h1 className="text-4xl uppercase font-bold tracking-tight text-primary">
              Profile
            </h1>
            {user?.email && <p className="text-sm text-neutral-400 mt-1">{user?.email}</p>}
          </div>
          <Button
            variant="outline"
            onClick={() => setOpenChangePasswordDialog(true)}
            className="w-full sm:w-auto border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </header>

        <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/60 rounded-xl shadow-2xl p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-primary mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {storageData && (
                <div className="bg-neutral-700/40 p-5 rounded-lg border border-neutral-600/50 shadow-md">
                  <ProfileStat
                    statName="System Space Usage"
                    statValue={`${((storageData.usedSpace * 100) / storageData.totalSpace).toFixed(1)}%`}
                  />
                  <div className="mt-2 h-1.5 w-full bg-neutral-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{ width: `${(storageData.usedSpace * 100) / storageData.totalSpace}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {(userStorageData || 0) >= 0 && storageData && (
                <div className="bg-neutral-700/40 p-5 rounded-lg border border-neutral-600/50 shadow-md">
                  <ProfileStat
                    statName="Your storage"
                    statValue={formatSize(userStorageData || 0)}
                  />
                  <div className="mt-2 h-1.5 w-full bg-neutral-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{ width: `${((userStorageData || 0) * 100) / storageData.totalSpace}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {data && data?.data?.length > 0 && (
            <section>
              <hr className="my-8 border-neutral-700/70" />
              <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary">
                  Your Active Links
                </h2>
                <span className="text-sm text-neutral-400 bg-neutral-700/60 px-2.5 py-1 rounded-md">
                  {data.data.length} active link{data.data.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="w-full overflow-x-auto bg-neutral-700/30 rounded-lg shadow-md">
                <TransferColumns
                  data={data.data}
                  reloader={refetch}
                />
              </div>
            </section>
          )}

          {data && data?.data?.length === 0 && !isLoading && (
            <div className="text-center py-10 text-neutral-500 border-t border-neutral-700/70 mt-8">
              <p className="text-lg">You have no active links.</p>
              <p className="text-sm">Upload some files to get started!</p>
            </div>
          )}
        </div>


        <Dialog open={openChangePasswordDialog} onOpenChange={setOpenChangePasswordDialog}>
          <DialogContent className="bg-white/5 backdrop-blur-2xl border-neutral-700 text-neutral-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-primary text-xl font-bold">Change Your Password</DialogTitle>
            </DialogHeader>
            <ChangePasswordForm />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
