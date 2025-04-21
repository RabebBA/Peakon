"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormsDemo() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[800px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a User</CardTitle>
          <CardDescription>Enter the required information</CardDescription>
        </CardHeader>

        {/* 🟨 Ici on force le scroll si ça dépasse */}
        <CardContent className="overflow-auto pr-2 ">
          <div className="flex flex-col gap-6 pr-1">
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-1/3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Joen" required />
              </div>
              <div className="flex flex-col gap-2 w-1/3">
                <Label htmlFor="lastname">Lastname</Label>
                <Input id="lastname" placeholder="Doe" required />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-1/3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@acme.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-1/3">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" placeholder="123 123 123" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-1/3">
                <Label htmlFor="job">Job Title</Label>
                <Input id="job" placeholder="ex: Web Developer" required />
              </div>
              <div className="flex flex-col gap-3 w-1/3">
                <Label htmlFor="matricule">Matricule</Label>
                <Input id="matricule" placeholder="ex: A1234" required />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="po">PO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <Label htmlFor="priv">Privilege</Label>
              <p className="text-muted-foreground text-sm">
                Grant an additional privilege
              </p>
              <Select>
                <SelectTrigger id="priv">
                  <SelectValue placeholder="Select a privilege" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <Label htmlFor="pwd">Password</Label>
              <Input
                id="pwd"
                type="password"
                placeholder="Strong password required (min 8 characters)"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal">
                  Send login instructions via email
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="newsletter" defaultChecked />
                <Label htmlFor="newsletter" className="font-normal">
                  Send privacy policy information to the user.
                </Label>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Create User</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
