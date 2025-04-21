"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MenuItemWithIcon = ({ icon, children, shortcut, external, disabled }) => (
  <DropdownMenuItem disabled={disabled} className="flex items-center gap-2">
    {icon && <img src={icon} alt="" className="w-4 h-4 object-contain" />}
    <span className="flex-1">{children}</span>
    {external && (
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/38e11085c38cff95b9ae2ce6d03a335822a1876cf2b19f3757a47d5ae2c54ba1"
        className="w-4 h-4 object-contain"
        alt="External link"
      />
    )}
    {shortcut && (
      <span className="text-xs text-muted-foreground ml-auto">{shortcut}</span>
    )}
  </DropdownMenuItem>
);

const AccountDropdownMenu = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 py-1.5">
          My Account
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/dbccd66f9e3b21442ca894c6ce14a8d6e7897c4208b912d15b659c2a3fb7493f"
            shortcut="⌘⇧B︎"
            onClick={() => navigate("/profil")}
          >
            Profile
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/db80eda887a8adf38dce7b208dbe898645df40a09fe850f1730887da7990927f"
            shortcut="⌘⇧B︎"
          >
            Billing
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/49ae15ec1cc4f275128b851ac029c2579dd4789754c98700697c9a6a46fad466"
            shortcut="⌘⇧B︎"
          >
            Settings
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0d5ccc87c251faa6a8104eb4ddfa8fcfe2925e48d2179b3b38c7fe80367a48f4"
            shortcut="⌘⇧B︎"
          >
            Keyboard shortcuts
          </MenuItemWithIcon>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItemWithIcon icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a2ad94395f48caa696440095fd99c5ce987f90aba647113f83fa7927b3b68e80">
            Team
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/db80eda887a8adf38dce7b208dbe898645df40a09fe850f1730887da7990927f"
            external
          >
            Invite users
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/32d4a5d278035db338d7e8c568896269b2856b86937113e009bbf7b55b4c12e4"
            shortcut="⌘⇧B︎"
          >
            New team
          </MenuItemWithIcon>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItemWithIcon icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f416e9d8f48f9626ec3227d71463365729be865bd8918ec09979c16516e9c7f">
            Github
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/be84231985499190e6a4929b901cf751f4cf505ec54957ff58dec95b906e6bf6"
            external
          >
            Support
          </MenuItemWithIcon>

          <MenuItemWithIcon
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/78fa294a63d1372b33dcca54040bf8425ddf928781ba36dbde46915cfbf328b0"
            disabled
          >
            API
          </MenuItemWithIcon>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <MenuItemWithIcon
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/24b20653aa23ebf1bc1153d70a11855841d0348262c9597eb0050c561db00521"
          shortcut="⌘⇧B︎"
        >
          Log out
        </MenuItemWithIcon>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdownMenu;
