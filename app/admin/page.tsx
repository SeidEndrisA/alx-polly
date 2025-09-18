'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Profile = {
  id: string;
  username: string;
  role: string;
};

export default function AdminPage() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (user) {
      const checkAdminRole = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data && data.role === 'admin') {
          setIsAdmin(true);
          fetchProfiles();
        } else {
          router.push('/polls');
        }
      };
      checkAdminRole();
    } else {
      router.push('/auth/signin');
    }
  }, [user, supabase, router]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (data) {
      setProfiles(data);
    } else {
      toast.error('Error fetching profiles');
    }
  };

  const handleRoleChange = async (profileId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profileId);

    if (error) {
      toast.error('Error updating role');
    } else {
      toast.success('Role updated successfully');
      fetchProfiles();
    }
  };

  if (!isAdmin) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select value={profile.role} onValueChange={(newRole) => handleRoleChange(profile.id, newRole)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}