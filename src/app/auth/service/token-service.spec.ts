import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { ConfigService } from "@nestjs/config";
import "jest-expect-jwt";
import { JwtPayload } from "./interface/jwt-payload.interface";

describe("TokenService", () => {

  let jWTService: JwtService;
  let tokenService: TokenService;

  beforeEach(() => {
    jWTService = new JwtService({ secret: "secret" });
    const configService = { get: jest.fn().mockReturnValue(Promise.resolve("10s")) } as Partial<ConfigService>;
    tokenService = new TokenService(jWTService, configService as ConfigService);
  });

  describe("generateToken", () => {
    const payload: JwtPayload = { email: "test@test.com", username: "Test" };

    it("should return token", async () => {
      const token = await tokenService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token).toBeTokenContaining(payload);
    });
  });
});
