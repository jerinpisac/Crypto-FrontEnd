import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/homePage");
  }, []);

  return <></>;
}
