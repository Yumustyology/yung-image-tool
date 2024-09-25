import CreateImageForm from "@/components/organisms/CreateImageForm";
import Header from "@/components/organisms/Header";
import { imageToolTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Create = async ({ params: { type } }: SearchParamProps) => {
  const imageToolInfo = imageToolTypes[type];
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  return (
    <div>
      <Header title={imageToolInfo.title} subtitle={imageToolInfo.subTitle} />
      <CreateImageForm
        action="Add"
        userId={user._id}
        type={imageToolInfo.type as CreateImageTypeKey}
        creditBalance={user.creditBalance}
      />
    </div>
  );
};

export default Create;
