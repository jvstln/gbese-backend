import { APIError } from "better-auth/api";
import { Response as ExpressResponse } from "express";
import { StatusCodes } from "../types/api.type";
import mongoose from "mongoose";
import { isAxiosError } from "axios";

/**
 * Sets a value at a nested path within an object.
 * The path is a dot-separated string representing the nested properties.
 * If parts of the path don't exist, they will be created.
 *
 * @param {T} obj - The object to modify
 * @param {string} path - A dot-separated path (e.g., 'prop.name.firstname')
 * @param {V} value - The value to set at the specified path
 * @returns {T} - The modified object (same reference as input)
 * @example
 * const obj = { prop: { id: 123 } };
 * setNestedValue(obj, 'prop.name.firstname', 'John');
 */
export function setNestedValue<T extends Record<string, unknown>, V>(
  obj: T,
  path: string,
  value: V
): T {
  // Split the path into components
  const pathParts: string[] = path.split(".");

  // Start at the top level object
  let current: Record<string, any> = obj;

  // Traverse the path until the second-to-last part
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part: string = pathParts[i];

    // If the current path part doesn't exist or isn't an object, create it
    if (!current[part] || typeof current[part] !== "object") {
      current[part] = {};
    }

    // Move to the next level
    current = current[part];
  }

  // Set the value at the final path location
  current[pathParts[pathParts.length - 1]] = value;
  return obj;
}

export const getObjectPath = (
  object: Record<string, unknown>,
  path: string
) => {
  const paths = path.split(".");
  let currentObject = object;

  paths.forEach((key) => {
    currentObject = currentObject?.[key] as Record<string, unknown>;
  });

  return currentObject;
};

export const handleRawResponse = async (
  res: ExpressResponse,
  rawResponse: Response,
  end?: boolean
) => {
  rawResponse.headers.forEach((value, key) => {
    res.set(key, value);
  });
  const responseBody = await rawResponse.json();

  if (rawResponse.status < 200 || rawResponse.status >= 300) {
    throw new APIError(
      rawResponse.statusText as keyof typeof StatusCodes,
      responseBody
    );
  }

  if (end) res.status(rawResponse.status).json(responseBody);

  return responseBody;
};

export const formatPaginatedDocs = (
  paginatedDocs: mongoose.AggregatePaginateResult<unknown>
) => {
  return {
    data: paginatedDocs.docs,
    metadata: {
      totalData: paginatedDocs.totalDocs,
      limit: paginatedDocs.limit,
      page: paginatedDocs.page,
      totalPages: paginatedDocs.totalPages,
      prevPage: paginatedDocs.prevPage,
      nextPage: paginatedDocs.nextPage,
    },
  };
};

export const getAxiosError = (
  error: unknown,
  defaultMessage: string = "Error processing external API"
) => {
  return isAxiosError(error)
    ? error.response?.data.message
    : error instanceof Error
    ? error.message
    : defaultMessage;
};

export function normalizeSearchParams(
  obj: Record<string, any>
): [string, string][] {
  const entries: [string, string][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((val) => entries.push([key, val]));
    } else {
      entries.push([key, String(value)]);
    }
  }

  return entries;
}
