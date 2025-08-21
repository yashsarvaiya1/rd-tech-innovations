import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/stores/admin";
import { doc, setDoc } from "firebase/firestore";
import { rdTechDb, collections } from "@/firebase";

export default function AddMemberForm() {
  const { admins, addAdmin } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    try {
      await setDoc(doc(rdTechDb, collections.admins, "admins"), {
        emails: [...admins, email],
      });
      addAdmin(email);
      (e.target as any).reset();
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" />
          </div>
          <Button type="submit">Add Admin</Button>
        </form>
        <ul className="mt-4 space-y-2">
          {admins.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
