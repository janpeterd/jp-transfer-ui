import { Button } from "./ui/button";
import { Link } from "lucide-react";

export function SignIn() {
  return (
    <Link to="/login">
      <Button type="submit" className="text-black">
        Sign In
      </Button>
    </Link>
  );
}
