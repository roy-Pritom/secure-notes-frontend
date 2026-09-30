import "server-only";
import { notFound } from "next/navigation";
import { isObjectId } from "@/lib/validations";
import { ApiError } from "./errors";

export async function fetchOr404<T>(id: string, load: (id: string) => Promise<T>): Promise<T> {
  if (!isObjectId(id)) notFound();
  try {
    return await load(id);
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.status === 400)) notFound();
    throw error;
  }
}
