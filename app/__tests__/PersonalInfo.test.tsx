import { render, screen } from "@testing-library/react";
import { useUserProfile } from "@/hooks/useUsers";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import PersonalInfo from "../(user)/user/account/components/PersonalInfoPage";

// Mock dependencies
jest.mock("@/hooks/useUsers", () => ({
  useUserProfile: jest.fn(),
}));

jest.mock("i18next", () => ({
  t: (key: string) => key,
  changeLanguage: jest.fn(),
  language: "en",
}));

describe("PersonalInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  const setup = () => {
    return render(
      <I18nextProvider i18n={i18next}>
        <PersonalInfo />
      </I18nextProvider>
    );
  };

  it("renders loading state", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    setup();
    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(screen.getByText("loading")).toHaveClass(
      "text-black dark:text-white"
    );
  });

  it("renders error state", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to load"),
    });

    setup();
    expect(
      screen.getByText("personalInfo.fields.cannotLoad")
    ).toBeInTheDocument();
    expect(screen.getByText("personalInfo.fields.cannotLoad")).toHaveClass(
      "text-black dark:text-white"
    );
  });

  it("renders user data correctly", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: {
        code: 200,
        statusCode: "Success",
        message: "OK",
        data: {
          fullName: "John Doe",
          address: "123 Main St",
          email: "john.doe@example.com",
          phoneNumber: "1234567890",
          rewardPoint: 1000,
          gender: 0,
          dateOfBirth: "1990-01-01",
        },
      },
      isLoading: false,
      error: null,
    });

    setup();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("personalInfo.title")).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.fullName")
    ).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("personalInfo.fields.male")).toBeInTheDocument();
    expect(screen.getByText("1990-01-01")).toBeInTheDocument();
  });

  it("renders fallback text for missing user data", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: { code: 200, statusCode: "Success", message: "OK", data: {} },
      isLoading: false,
      error: null,
    });

    setup();
    expect(screen.getByText("personalInfo.fields.noName")).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noAddress")
    ).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noFullName")
    ).toBeInTheDocument();
    expect(screen.getByText("personalInfo.fields.noEmail")).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noPhoneNumber")
    ).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noRewardPoints")
    ).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.unspecified")
    ).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noDateOfBirth")
    ).toBeInTheDocument();
  });

  it("renders female gender", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: {
        code: 200,
        statusCode: "Success",
        message: "OK",
        data: { gender: 1 },
      },
      isLoading: false,
      error: null,
    });

    setup();
    expect(screen.getByText("personalInfo.fields.female")).toBeInTheDocument();
  });

  it("renders unspecified gender", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: {
        code: 200,
        statusCode: "Success",
        message: "OK",
        data: { gender: 2 },
      },
      isLoading: false,
      error: null,
    });

    setup();
    expect(
      screen.getByText("personalInfo.fields.unspecified")
    ).toBeInTheDocument();
  });

  it("handles undefined rewardPoint", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: {
        code: 200,
        statusCode: "Success",
        message: "OK",
        data: { rewardPoint: undefined },
      },
      isLoading: false,
      error: null,
    });

    setup();
    expect(
      screen.getByText("personalInfo.fields.noRewardPoints")
    ).toBeInTheDocument();
  });

  it("handles null profileData", () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    setup();
    expect(screen.getByText("personalInfo.fields.noName")).toBeInTheDocument();
    expect(
      screen.getByText("personalInfo.fields.noAddress")
    ).toBeInTheDocument();
  });
});
