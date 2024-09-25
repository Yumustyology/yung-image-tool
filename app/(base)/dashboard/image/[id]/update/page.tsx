import CreateImageForm from "@/components/organisms/CreateImageForm";
import Header from "@/components/organisms/Header";
import { imageToolTypes } from "@/constants";
import { getImageById } from "@/lib/actions/Image.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = await getImageById(id);

  const transformation =
    imageToolTypes[image.createImageType as CreateImageTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <CreateImageForm
          action="Update"
          userId={user._id}
          type={image.createImageType as CreateImageTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;