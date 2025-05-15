import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Pencil, Trash2, Loader2, Eye } from "lucide-react";

const ADMIN_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/admin`;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    fullname: "",
    email: ""
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ADMIN_API_END_POINT}/get-users`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      setIsDeleting(prev => ({ ...prev, [userId]: true }));

      const response = await axios.get(`${ADMIN_API_END_POINT}/delete-user/${userId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting user");
    } finally {
      setIsDeleting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleOpenUpdateDialog = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      fullname: user.fullname,
      email: user.email
    });
    setIsUpdateDialogOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setIsUpdating(true);

      const response = await axios.post(
        `${ADMIN_API_END_POINT}/update-user/${selectedUser._id}`,
        updateFormData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(users.map(user =>
          user._id === selectedUser._id
            ? { ...user, ...updateFormData }
            : user
        ));

        toast.success("User updated successfully");
        setIsUpdateDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "An error occurred while updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button
          variant="outline"
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#7209b7]" />
        </div>
      ) : (
        <Table>
          <TableCaption>List of all users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenUpdateDialog(user)}
                        className="flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Update User Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={updateFormData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={updateFormData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-[#7209b7] hover:bg-[#5f32ad]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Profile Photo */}
              <div className="flex justify-center mb-6">
                {selectedUser?.profile?.profilePhoto ? (
                  <img
                    src={selectedUser.profile.profilePhoto}
                    alt={selectedUser.fullname}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                    {selectedUser.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg font-semibold">{selectedUser.fullname}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{selectedUser.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1">{selectedUser.role || "User"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Additional User Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p className="text-sm text-gray-500">
                      {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Account Status</h4>
                    <p className="text-sm text-gray-500">
                      {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDetailsDialogOpen(false);
                handleDeleteUser(selectedUser._id);
              }}
              disabled={isDeleting[selectedUser?._id]}
              className="flex items-center gap-1"
            >
              {isDeleting[selectedUser?._id] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
