"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { RoleMultiSelect } from "@/components/workflow/role-multi-select";
import { useAccessData } from "@/components/role/projectData-fetch";
import { privateFetch } from "../../../utils/fetch";
import { toast } from "sonner";

const CreateUserDialog = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");
  const [job, setJob] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const roleIds = selectedRoles.map((role) =>
    typeof role === "string" ? role : role.value
  );

  // Récupération des rôles disponibles
  const { availableRoles, availablePrivileges } = useAccessData("global");

  // Validation simple du formulaire
  const validateForm = () => {
    const errors = {};
    if (selectedRoles.length === 0) {
      errors.roles = "Please select at least one role.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      firstname,
      lastname,
      email,
      matricule,
      job,
      phone,
      roleId: selectedRoles,
    };

    try {
      setLoading(true);
      setFormErrors({});
      const response = await privateFetch.post("/users", userData);
      if (response.status === 201) {
        toast.success("User created successfully!");
        setFirstname("");
        setLastname("");
        setEmail("");
        setMatricule("");
        setJob("");
        setPhone("");
        setSelectedRoles([]);
      } else {
        setFormErrors({ general: "Unexpected server response." });
      }
    } catch (error) {
      setFormErrors({ general: "Failed to create user. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:from-blue-600 hover:to-purple-600"
        >
          <PlusCircle size={16} className="text-white" />
          Create User
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a User</DialogTitle>
          <DialogDescription>Enter the required information</DialogDescription>
        </DialogHeader>

        <CardContent className="overflow-auto max-h-[70vh] pr-2 p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              {/* Champs texte classiques */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="firstname">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Joen"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="lastname">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email et matricule */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@acme.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="matricule">
                    Serial Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="ex: A1234"
                    required
                  />
                </div>
              </div>

              {/* Job et phone */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="job">Job Title</Label>
                  <Input
                    id="job"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="ex: Web Developer"
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="123 123 123"
                  />
                </div>
              </div>

              {/* Sélection des rôles */}
              <div className="flex flex-col gap-2">
                <Label>
                  Roles <span className="text-red-500">*</span>
                </Label>
                <RoleMultiSelect
                  value={selectedRoles}
                  onChange={setSelectedRoles}
                  availablePrivileges={availablePrivileges}
                  options={availableRoles}
                  placeholder="Select one or more roles"
                />
                {formErrors.roles && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.roles}
                  </p>
                )}
              </div>
            </div>

            {/* Erreur générale */}
            {formErrors.general && (
              <p className="text-red-500 mt-4">{formErrors.general}</p>
            )}

            <DialogFooter className="mt-4 w-full px-4">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
