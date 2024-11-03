import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { deleteProject } from "../../../backend/controllers/projectController";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Projects", "Reports", "Users"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Projects
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Project"],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    

    
    updateProject: builder.mutation({
      query: ({ id, ...project }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Reports
    getReports: builder.query({
      query: (projectId) => `/reports/${projectId}`, // Use route parameter instead of query parameter
      providesTags: ["Reports"],
    }),
    getReport: builder.query({
      query: (id) => `/reports/report/${id}`,
      providesTags: ["Reports"],
    }),
    createReport: builder.mutation({
      query: (report) => ({
        url: "/reports",
        method: "POST",
        body: report,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateReport: builder.mutation({
      query: ({ id, ...report }) => ({
        url: `/reports/${id}`,
        method: "PUT",
        body: report,
      }),
      invalidatesTags: ["Reports"],
    }),
    editReport: builder.mutation({
      query: ({ id, updatedData}) => ({
        url: `/reports/edit/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Reports"],
    }),

    // Users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    addUser: builder.mutation({
      query: ({ projectId, email }) => ({
        url: `/projects/${projectId}/add`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Projects","Project"], 
    }),
    deleteUser: builder.mutation({
      query: ({ projectId, memberId }) => ({
        url: `/projects/${projectId}/remove/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects","Project"], 
    }),

    deleteReport: builder.mutation({
      query: (reportId) => ({
        url: `/reports/${reportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

  
    // Delete User
    deleteUserDatabase: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], 
    }),

    // Change User Role
    changeUserRole: builder.mutation({
      query: ({ userId, role }) => ({  // Changed newRole to role
        url: `/users/${userId}/role`,
        method: "PUT",
        body: { userType: role }, // Sending userType
      }),
      invalidatesTags: ["Users"], 
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetReportsQuery,
  useGetReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useChangePasswordMutation,
  useAddUserMutation,
  useDeleteUserMutation,
  useDeleteUserDatabaseMutation,
  useChangeUserRoleMutation,
  useDeleteReportMutation,
  useEditReportMutation,
  useDeleteProjectMutation

 
} = api;
