"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/hooks/useUsers";

export default function PersonalInfo() {
  const { t } = useTranslation(); // Sử dụng namespace profilePage
  const { data: profileData, isLoading, error } = useUserProfile();

  if (isLoading)
    return <div className="text-black dark:text-white">{t("loading")}</div>;
  console.log(profileData);

  if (error)
    return (
      <div className="text-black dark:text-white">
        {t("personalInfo.fields.cannotLoad")}
      </div>
    );
  // data format: { code, statusCode, message, data: user }
  const user = profileData?.data;

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {user?.fullName || t("personalInfo.fields.noName")}
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user?.address || t("personalInfo.fields.noAddress")}
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {t("personalInfo.title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.fullName")}
            </p>
            <p className="text-black dark:text-white">
              {user?.fullName || t("personalInfo.fields.noFullName")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.rewardPoints")}
            </p>
            <p className="text-black dark:text-white">
              {user?.rewardPoint !== undefined
                ? user.rewardPoint.toLocaleString("vi-VN")
                : t("personalInfo.fields.noRewardPoints")}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.email")}
            </p>
            <p className="text-black dark:text-white">
              {user?.email || t("personalInfo.fields.noEmail")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.phoneNumber")}
            </p>
            <p className="text-black dark:text-white">
              {user?.phoneNumber || t("personalInfo.fields.noPhoneNumber")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.gender")}
            </p>
            <p className="text-black dark:text-white">
              {user?.gender === "Male"
                ? t("personalInfo.fields.male")
                : user?.gender === "Female"
                ? t("personalInfo.fields.female")
                : t("personalInfo.fields.unspecified")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("personalInfo.fields.dateOfBirth")}
            </p>
            <p className="text-black dark:text-white">
              {user?.dateOfBirth || t("personalInfo.fields.noDateOfBirth")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
