import { APIError } from "better-auth/api";
import { Response as ExpressResponse } from "express";
import { StatusCodes } from "../types/api.type";

export const createObjectPath = (
  object: Record<string, unknown>,
  path: string,
  value: unknown
) => {
  const paths = path.split(".");

  const getNextValue = (nextPath: string | undefined) =>
    !nextPath
      ? value
      : Number.isInteger(+nextPath) && parseInt(nextPath) >= 0
      ? []
      : {};

  let currentObject = object;

  paths.forEach((key, index) => {
    if (!currentObject[key]) {
      currentObject[key] = getNextValue(paths[index + 1]);
    }

    currentObject = currentObject[key] as Record<string, unknown>;
  });
};

export const getObjectPath = (
  object: Record<string, unknown>,
  path: string
) => {
  const paths = path.split(".");

  let currentObject = object;

  paths.forEach((key) => {
    currentObject = currentObject[key] as Record<string, unknown>;
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
