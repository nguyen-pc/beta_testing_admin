import {
  type IBackendRes,
  type IAccount,
  type IUser,
  type IPermission,
  type IRole,
  type IModelPaginate,
  type IProject,
  type IUseCase,
  type IScenario,
  type ITestcase,
  type ISurvey,
  type IQuestion,
  type IUserProfile,
  type ITesterCampaign,
  type ITesterCampaignStatus,
} from "./../types/backend.d";

import axios from "../config/axios-customize";

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
  console.log("callRegister", {
    name,
    email,
    password,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
  });
};

export const callRegisterRecruiter = (
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
  taxNumber?: string,
  companyName?: string
) => {
  console.log("callRegister", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
};

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
    username,
    password,
  });
};
export const callLoginGoogle = (token: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login-google", {
    token,
  });
};

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

export const callLogout = () => {
  return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};

export const callForgotPassword = (email: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/forgot_password?email=${encodeURIComponent(email)}`
  );
};

export const callResetPassword = (token: string, newPassword: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/reset_password?token=${token}`,
    { newPassword }
  );
};


// User
export const callCreateUser = (user: IUser) => {
  return axios.post<IBackendRes<IUser>>("/api/v1/users", { ...user });
};

export const callUpdateUser = (user: IUser) => {
  return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { ...user });
};

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callFetchUser = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(
    `/api/v1/users?${query}`
  );
};
export const callFetchUserById = (id: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callFetchUserByCompanyId = (companyId: string) => {
  return axios.get<IBackendRes<IUser[]>>(
    `/api/v1/users/company/${companyId}`
  );
}


// Module permission

export const callCreatePermission = (permission: IPermission) => {
  return axios.post<IBackendRes<IPermission>>("/api/v1/permissions", {
    ...permission,
  });
};

export const callUpdatePermission = (permission: IPermission, id: string) => {
  return axios.put<IBackendRes<IPermission>>("/api/v1/permissions", {
    id,
    ...permission,
  });
};

export const callDeletePermission = (id: string) => {
  return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
};

export const callFetchPermission = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPermission>>>(
    `/api/v1/permissions?${query}`
  );
};

export const callFetchPermissionById = (id: string) => {
  return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
};

// Module Role

export const callCreateRole = (role: IRole) => {
  return axios.post<IBackendRes<IRole>>("/api/v1/roles", {
    ...role,
  });
};

export const callUpdateRole = (role: IRole, id: string) => {
  return axios.put<IBackendRes<IRole>>("/api/v1/roles", {
    id,
    ...role,
  });
};

export const callDeleteRole = (id: string) => {
  return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
};

export const callFetchRoleById = (id: string) => {
  return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
};

export const callFetchRole = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IRole>>>(
    `/api/v1/roles?${query}`
  );
};



// Module Project

export const callFetchAllProjects = (query: string) => {
  console.log("callFetchAllProjects", { query });
  return axios.get<IBackendRes<IModelPaginate<IProject>>>(
    `/api/v1/projects?${query}`
  );
};

export const callUpdateProject = (id: number, data: IProject) => {
  console.log("callUpdateProject", { id, data });
  return axios.put<IBackendRes<IProject>>(
    `/api/v1/projects/update/${id}`,
    data
  );
};

export const callGetProject = (id: number) => {
  return axios.get<IBackendRes<IProject>>(`/api/v1/projects/${id}`);
};
export const callFetchProjectByCompany = (id: string, query: string) => {
  console.log("callFetchProjectByCompany", { id, query });
  return axios.get<IBackendRes<IModelPaginate<IProject>>>(
    `/api/v1/projects/all/${id}?${query}`
  );
};

export const callDeleteProject = (id: string) => {
  console.log("callDeleteProject", { id });
  return axios.delete<IBackendRes<null>>(`/api/v1/projects/${id}`);
};

//Module Campaign

export const callFetchCampaignByProject = (id: string, query: string) => {
  console.log("callFetchCampaignByProject", { id, query });
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/project/${id}/campaigns?${query}`
  );
};

export const callGetCampaign = (id: number) => {
  return axios.get<IBackendRes<ICampaign>>(`/api/v1/campaign/${id}`);
};
export const callCreateCampaign = (data: ICampaign) => {
  console.log("callCreateCampaign", data);
  return axios.post<IBackendRes<ICampaign>>("/api/v1/campaign/create", data);
};

export const callGetAllCampaigns = (query: string) => {
  console.log("callGetAllCampaigns", { query });
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/campaigns?${query}`
  );
}

export const callUpdateCampaignStatus = (campaignId: string | number, status: string) => {
  return axios.put(`/api/v1/campaign/${campaignId}/status?status=${status}`);
};

// Module Campaign
export const callGetUseCasesByCampaign = (
  campaignId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<IUseCase>>>(
    `/api/v1/usecase/campaign/${campaignId}?${query}`
  );
};

export const callCreateUseCase = (data: Partial<IUseCase>) => {
  return axios.post<IBackendRes<IUseCase>>("/api/v1/usecase/create", data);
};

export const callUpdateUseCase = (id: number, data: Partial<IUseCase>) => {
  return axios.put<IBackendRes<IUseCase>>(`/api/v1/usecase/update/${id}`, data);
};

export const callDeleteUseCase = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/delete/${id}`);
};

// Module Scenario
export const callGetScenariosByUseCase = (useCaseId: number, query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IScenario>>>(
    `/api/v1/usecase/${useCaseId}/test_scenario?${query}`
  );
};

export const callCreateScenario = (data: IScenario) => {
  console.log("callCreateScenario", data);
  return axios.post<IBackendRes<IScenario>>(
    "/api/v1/usecase/test_scenario/create",
    data
  );
};

export const callUpdateScenario = (id: number, data: Partial<IScenario>) => {
  console.log(data, id);
  return axios.put<IBackendRes<IScenario>>(
    `/api/v1/usecase/test_scenario/update/${id}`,
    data
  );
};

export const callDeleteScenario = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/delete/${id}`
  );
};

// Module Testcase
export const callGetTestcasesByScenario = (
  scenarioId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<ITestcase>>>(
    `/api/v1/usecase/test_scenario/${scenarioId}/testcase?${query}`
  );
};

export const callCreateTestcase = (data: Partial<ITestcase>) => {
  console.log("callCreateTestcase", data);
  return axios.post<IBackendRes<ITestcase>>(
    "/api/v1/usecase/test_scenario/testcase/create",
    data
  );
};

export const callUpdateTestcase = (id: number, data: Partial<ITestcase>) => {
  console.log("callUpdateTestcase", { id, data });
  return axios.put<IBackendRes<ITestcase>>(
    `/api/v1/usecase/test_scenario/testcase/update/${id}`,
    data
  );
};

export const callDeleteTestcase = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/testcase/delete/${id}`
  );
};

export async function callCreateSurvey(campaignId: string, data: ISurvey) {
  console.log("Creating survey on server:", data);
  return axios.post<IBackendRes<ISurvey>>(
    `/api/v1/campaign/${campaignId}/survey`,
    data
  );
}

// question
export async function callCreateQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  data: Partial<IQuestion>
) {
  console.log("Creating question on server:", data);
  return axios.post<IBackendRes<IQuestion>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question`,
    data
  );
}

export async function callDeleteQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  questionId: string
) {
  console.log("Deleting question on server:", questionId);
  return axios.delete<IBackendRes<null>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question/${questionId}`
  );
}

//recruiting campaign
export async function callCreateRecruitingCampaign(data: ICampaign) {
  console.log("callCreateRecruitingCampaign", data);
  return axios.post<IBackendRes<ICampaign>>(
    "/api/v1/recruit-profile/create",
    data
  );
}

//user profile
export async function callCreateUserProfile(
  userId: string,
  data: IUserProfile
) {
  console.log("callCreateUserProfile", data);
  return axios.post<IBackendRes<IUserProfile>>(
    `/api/v1/user/profile/${userId}`,
    data
  );
}

export async function callGetUserProfile(userId: string) {
  console.log("callGetUserProfile", userId);
  return axios.get<IBackendRes<IUserProfile>>(`/api/v1/user/profile/${userId}`);
}

// Apply campaign
export async function callApplyCampaign(data: ITesterCampaign) {
  console.log("callApplyCampaign", data);
  return axios.post<IBackendRes<ITesterCampaign>>(
    `/api/v1/campaign/tester-campaign/apply`,
    data
  );
}

export async function callGetTesterCampaignStatus(
  userId: string,
  campaignId: string
) {
  console.log("callGetTesterCampaignStatus", { userId, campaignId });
  return axios.get<IBackendRes<ITesterCampaignStatus>>(
    `/api/v1/campaign/${campaignId}/tester-campaign/status`,
    {
      params: { userId },
    }
  );
}

export async function callGetCampaignByUser(userId: string) {
  console.log("callGetCampaignByUser", userId);
  return axios.get<IBackendRes<IModelPaginate<any>>>(
    `/api/v1/campaign/tester-campaigns/user/${userId}`
  );
}

export async function callFetchCompany() {
  console.log("callFetchCompany");
  return axios.get<IBackendRes<any>>(
    `/api/v1/company`
  );
}

export async function callFetchCompanyById(id: string) {
  console.log("callFetchCompanyById", id);
  return axios.get<IBackendRes<any>>(
    `/api/v1/company/${id}`
  );
}

export async function callCreateCompany(data: any) {
  console.log("callCreateCompany", data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/company/create`,
    data
  );
}

export async function callUpdateCompany(id: string, data: any) {
  console.log("callUpdateCompany", { id, data });
  return axios.put<IBackendRes<any>>(
    `/api/v1/company/update/${id}`,
    data
  );
} 

export async function callDeleteCompany(id: string) {
  console.log("callDeleteCompany", id);
  return axios.delete<IBackendRes<any>>(
    `/api/v1/company/delete/${id}`
  );
}

export async function callSwitchStatusCompany(id: string) {
  console.log("callSwitchStatusCompany", id);
  return axios.put<IBackendRes<any>>(
    `/api/v1/company/switch-status/${id}`
  );
}

export async function callSendEmailAccount(data: any) {
  console.log("callSendEmailAccount", data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/email/send-account-info`,
    data
  );
}