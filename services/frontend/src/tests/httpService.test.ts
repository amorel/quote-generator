import { httpService } from "../services/httpService";
import { tokenService } from "../services/tokenService";

jest.mock("../services/tokenService");

describe("HttpService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add auth token to headers when available", async () => {
    const mockToken = "test-token";
    (tokenService.getToken as jest.Mock).mockReturnValue(mockToken);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
      headers: new Headers({ "content-type": "application/json" }),
    });

    await httpService.get("/test-endpoint");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      })
    );
  });

  it("should handle 401 responses correctly", async () => {
    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Unauthorized" }),
    });

    await expect(httpService.get("/test-endpoint")).rejects.toThrow();
    expect(dispatchEventSpy).toHaveBeenCalled();
  });
});
