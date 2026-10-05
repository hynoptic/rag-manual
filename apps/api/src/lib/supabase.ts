import { createClient } from "@supabase/supabase-js";

export function createUserClient(accessToken: string) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export function getAccessToken(
  req: { headers: { authorization: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { error: string }): any; new (): any };
    };
  },
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing bearer token",
    });
  }

  const accessToken = authHeader.slice(7).trim();

  if (!accessToken) {
    return res.status(401).json({
      error: "Missing bearer token",
    });
  }

  return accessToken;
}
