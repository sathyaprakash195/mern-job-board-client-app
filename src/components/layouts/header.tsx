import { useState } from "react";
import { useUsersStore, type UsersStore } from "@/store/users-store";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavMenu } from "./nav-menu";

function Header() {
  const { user }: UsersStore = useUsersStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center bg-primary py-5 px-10">
        <h1 className="text-2xl text-white font-bold">Next Hire</h1>

        <div className="flex gap-5 items-center">
          <h1 className="text-sm text-white">
            {user?.name} ({user?.role})
          </h1>
          <Menu
            className="text-white cursor-pointer"
            size={16}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-w-[350px]">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <NavMenu role={user?.role || ""} onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Header;
