import { useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const useNotifications = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      const data = navigation.formData;
      const action = data?.get("action");

      switch (action) {
        case "DOWN_VOTES":
          toast("Downvoted!", { duration: 1500 });
          break;
        case "UP_VOTES":
          toast("Upvoted!", { duration: 1500 });
          break;
        case "SUBMIT_QUESTION":
          toast("Question submitted!", { duration: 1500 });
          break;
        default:
          break;
      }
    }
  }, [navigation]);
};
