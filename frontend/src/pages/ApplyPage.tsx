import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLoan } from "../helpers/api-communicators"; // Adjust import path

import { toast } from "sonner";
import { useUser } from "../Routing/UserContext"; // Adjust path
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LoanData {
  userId: string;
  customerName: string;
  amount: number;
  reason: string;
}

const ApplyPage: React.FC = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [reason, setReason] = useState("");
  const [employmentAddress, setEmploymentAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const loanData: LoanData = {
        userId: user.id,
        customerName: user.name,
        amount: Number.parseFloat(amount),
        reason,
      };

      await createLoan(loanData);

      toast.success("Your loan application has been submitted successfully.");

      navigate("/dashboard");
    } catch (error) {
      toast.error(`Failed to submit loan application: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">CREDIT APP</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {user ? `${user.name} (${user.role})` : "Guest"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center mb-8">APPLY FOR A LOAN</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name as it appears on bank account</Label>
                  <Input
                    id="fullName"
                    value={user ? user.name : ""}
                    readOnly
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">How much do you need?</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="How much do you need?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan tenure (in months)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    placeholder="Loan tenure (in months)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment status</Label>
                  <Select onValueChange={setEmploymentStatus} required>
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reason">Reason for loan</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for loan"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employmentAddress">Employment address</Label>
                  <Textarea
                    id="employmentAddress"
                    value={employmentAddress}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmploymentAddress(e.target.value)}
                    placeholder="Employment address"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked: boolean | "indeterminate") => setTermsAccepted(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read the important information and accept that by completing the application I will be bound
                    by the terms
                  </label>
                  <p className="text-sm text-gray-500">
                    Any personal and credit information obtained may be disclosed from time to time to other lenders,
                    credit bureaus or other credit reporting agencies.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-800 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyPage;