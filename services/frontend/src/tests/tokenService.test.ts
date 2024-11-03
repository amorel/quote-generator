import { tokenService } from "../services/tokenService";

describe("TokenService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should store and retrieve token", () => {
    const testToken = "test-token";
    tokenService.setToken(testToken);
    expect(tokenService.getToken()).toBe(testToken);
  });

  it("should remove token", () => {
    const testToken = "test-token";
    tokenService.setToken(testToken);
    tokenService.removeToken();
    expect(tokenService.getToken()).toBeNull();
  });

  it("should check if token exists", () => {
    expect(tokenService.hasToken()).toBe(false);
    tokenService.setToken("test-token");
    expect(tokenService.hasToken()).toBe(true);
  });
});
