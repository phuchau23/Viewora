"use client"

import type React from "react"

import { useState } from "react"
import type { User, FormErrors, EditLog } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: User) => Promise<void>
}

export default function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<User>({
    ...user,
    address: user.address ? { ...user.address } : { street: "", city: "", country: "" },
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required"
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }
    if (!formData.sex) {
      newErrors.sex = "Sex is required"
    }
    if (!formData.identityCard?.trim()) {
      newErrors.identityCard = "Identity card is required"
    }

    // Address validations
    if (!formData.address?.street?.trim()) {
      newErrors.address = { ...newErrors.address, street: "Street is required" }
    }
    if (!formData.address?.city?.trim()) {
      newErrors.address = { ...newErrors.address, city: "City is required" }
    }
    if (!formData.address?.country?.trim()) {
      newErrors.address = { ...newErrors.address, country: "Country is required" }
    }

    // Password validation (if changing password)
    if (showPassword) {
      if (!password.trim()) {
        newErrors.password = "Password is required"
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const logEditEvent = async (status: "success" | "failed", changes: Record<string, { old: any; new: any }>) => {
    const log: EditLog = {
      id: `log_${Date.now()}`,
      employeeId: undefined, // Would be set if an employee made the change
      memberId: user.id,
      timestamp: new Date().toISOString(),
      status,
      changes,
    }

    // In a real application, this would be sent to your logging API
    console.log("Edit Profile Log:", log)

    // Simulate API call to log the event
    try {
      // await fetch('/api/logs/profile-edits', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // })
    } catch (error) {
      console.error("Failed to log edit event:", error)
    }
  }

  const getChanges = (original: User, updated: User): Record<string, { old: any; new: any }> => {
    const changes: Record<string, { old: any; new: any }> = {}

    // Compare all fields
    const fieldsToCompare = ["firstName", "lastName", "email", "phone", "dateOfBirth", "sex", "identityCard"]

    fieldsToCompare.forEach((field) => {
      if (original[field as keyof User] !== updated[field as keyof User]) {
        changes[field] = {
          old: original[field as keyof User],
          new: updated[field as keyof User],
        }
      }
    })

    // Compare address
    if (original.address && updated.address) {
      ;["street", "city", "country"].forEach((addressField) => {
        if (
          original.address![addressField as keyof typeof original.address] !==
          updated.address![addressField as keyof typeof updated.address]
        ) {
          changes[`address.${addressField}`] = {
            old: original.address![addressField as keyof typeof original.address],
            new: updated.address![addressField as keyof typeof updated.address],
          }
        }
      })
    }

    if (showPassword && password) {
      changes.password = {
        old: "[HIDDEN]",
        new: "[UPDATED]",
      }
    }

    return changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const changes = getChanges(user, formData)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await onSave(formData)

      // Log successful edit
      await logEditEvent("success", changes)

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      // Log failed edit
      const changes = getChanges(user, formData)
      await logEditEvent("failed", changes)

      setErrors({
        general: "Failed to update profile. Please try again.",
      } as FormErrors & { general: string })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAddressChange = (field: keyof NonNullable<User["address"]>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, [field]: value },
    }))
    // Clear address error when user starts typing
    if (errors.address?.[field]) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: undefined },
      }))
    }
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">Success!</h3>
            <p className="text-center text-gray-600">Update information successfully</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Account Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Password</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Cancel" : "Change Password"}
                </Button>
              </div>

              {showPassword && (
                <div className="space-y-3">
                  <div>
                    <Input
                      type="password"
                      placeholder="New Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm New Password *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Personal Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <Label htmlFor="sex">Sex *</Label>
                <Select value={formData.sex || ""} onValueChange={(value) => handleInputChange("sex", value)}>
                  <SelectTrigger className={errors.sex ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-sm text-red-500 mt-1">{errors.sex}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identityCard">Identity Card *</Label>
                <Input
                  id="identityCard"
                  value={formData.identityCard || ""}
                  onChange={(e) => handleInputChange("identityCard", e.target.value)}
                  className={errors.identityCard ? "border-red-500" : ""}
                />
                {errors.identityCard && <p className="text-sm text-red-500 mt-1">{errors.identityCard}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Address Information</h4>

            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.address?.street || ""}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className={errors.address?.street ? "border-red-500" : ""}
              />
              {errors.address?.street && <p className="text-sm text-red-500 mt-1">{errors.address.street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address?.city || ""}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className={errors.address?.city ? "border-red-500" : ""}
                />
                {errors.address?.city && <p className="text-sm text-red-500 mt-1">{errors.address.city}</p>}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.address?.country || ""}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  className={errors.address?.country ? "border-red-500" : ""}
                />
                {errors.address?.country && <p className="text-sm text-red-500 mt-1">{errors.address.country}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
