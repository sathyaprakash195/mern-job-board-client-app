import { useUsersStore, type UsersStore } from "@/store/users-store";

function ProfileCard() {
  const { user }: UsersStore = useUsersStore();
  return (
    <div className="p-5 border border-gray-500 flex flex-col w-max">
      {user && (
        <>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </>
      )}
    </div>
  );
}

export default ProfileCard;
