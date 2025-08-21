import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { rdTechAuth, rdTechDb, collections } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { FirebaseError } from "firebase/app";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, message, setMessage } = useAuthStore();

  if (user) {
    router.push("/admin");
  }

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(rdTechAuth, provider);
      setUser(result.user);
      console.log("Signed in user:", { email: result.user.email, uid: result.user.uid });
    } catch (error: unknown) {
      const errorMessage = error instanceof FirebaseError ? error.message : "Unknown sign-in error";
      console.error("Sign-in error:", {
        message: errorMessage,
        code: error instanceof FirebaseError ? error.code : "unknown",
      });
      setMessage("Failed to sign in with Google. Please try again.");
    }
  };

  // Optional: Keep initializeAdmins for future admin additions
  const initializeAdmins = async () => {
    if (!user || !user.email) {
      setMessage("Please sign in first to initialize the admins list.");
      console.error("No user or email found");
      return;
    }
    try {
      console.log("Initializing admins list with:", {
        email: user.email,
        uid: user.uid,
        document: `${collections.admins}/admins`,
      });
      await setDoc(doc(rdTechDb, collections.admins, "admins"), {
        emails: [user.email],
      });
      setMessage("Admins list initialized successfully with your email!");
      console.log("Admins list initialized with email:", user.email);
      router.push("/admin");
    } catch (error: unknown) {
      const errorMessage = error instanceof FirebaseError ? error.message : "Unknown error";
      const errorCode = error instanceof FirebaseError ? error.code : "unknown";
      console.error("Error initializing admins list:", {
        message: errorMessage,
        code: errorCode,
        stack: error instanceof Error ? error.stack : undefined,
      });
      setMessage(`Failed to initialize admins list: ${errorMessage} (Code: ${errorCode})`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Sign-In</h1>
      {!user ? (
        <Button onClick={signIn} className="mt-4">
          Sign in with Google
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>Signed in as {user.email}</p>
          {/* Optional: Comment out or remove after initial setup */}
          <Button onClick={initializeAdmins} className="mt-4">
            Initialize Admins List
          </Button>
        </div>
      )}
      {message && (
        <Alert className="mt-4 max-w-md">
          <AlertTitle>{message.includes("Failed") ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </main>
  );
}
