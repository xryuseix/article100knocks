import {
  assert,
  assertFalse,
} from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { isValidUrl } from "./utils.ts";

Deno.test("uniq", () => {
  const actual = isValidUrl("https://example.com");
  assert(actual);

  const actual2 = isValidUrl("https://example.com/");
  assert(actual2);

  const actual3 = isValidUrl("ws://example.com/");
  assertFalse(actual3);
});
