/* eslint-disable camelcase */
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response(
      "Server configuration error: WEBHOOK_SECRET not found",
      {
        status: 500,
      }
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing webhook headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    // Handle 'unknown' error type
    let errorMessage = "Unknown error occurred during webhook verification";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    console.error("Error verifying webhook:", err);
    return new Response(`Webhook verification failed: ${errorMessage}`, {
      status: 400,
    });
  }

  // Get the event type and data
  const eventType = evt.type;
  const { id } = evt.data;

  try {
    // Handle user.created
    if (eventType === "user.created") {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      const newUser = await createUser(user as CreateUserParams);

      if (newUser) {
        await clerkClient.users.updateUserMetadata(id!, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: "User created successfully", user: newUser });
    }

    // Handle user.updated
    if (eventType === "user.updated") {
      const { image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name,
        lastName: last_name,
        username: username!,
        photo: image_url,
      };

      const updatedUser = await updateUser(id!, user as UpdateUserParams);

      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    }

    // Handle user.deleted
    if (eventType === "user.deleted") {
      const deletedUser = await deleteUser(id!);

      return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
    }

    console.log(`Unhandled webhook type: ${eventType} with ID: ${id}`);
    return new Response("Unhandled event type", { status: 200 });
  } catch (error) {
    // Handle 'unknown' error type
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error processing webhook event:", error);
    return new Response(
      `Failed to process webhook: ${errorMessage}`,
      { status: 500 }
    );
  }
}
