import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getHierarchy: builder.query<any[], { includeInactive?: boolean } | void>({
      query: (params) => ({
        url: '/admin/hierarchy',
        params: params || {},
      }),
      transformResponse: (response: any) => response.data || [],
      providesTags: ['User'],
    }),
    createUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/users/create-direct',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getMyTeam: builder.query<any[], { userId?: string; startDate?: string; endDate?: string }>({
      query: ({ userId, startDate, endDate }) => ({
        url: userId ? `/users/team-by-id/${userId}` : '/users/my-team',
        params: { startDate, endDate },
      }),
      providesTags: ['User'],
    }),
    getProfileStats: builder.query<any, { id: string; startDate: string; endDate: string }>({
      query: ({ id, startDate, endDate }) => ({
        url: `/users/profile-stats/${id}`,
        params: { startDate, endDate },
      }),
      providesTags: ['User'],
    }),
    getAdminExpenseOverview: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/expenses/admin/overview',
        params,
      }),
    }),
    getAdminRecentClaims: builder.query<any[], { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/expenses/admin/recent',
        params
      }),
      transformResponse: (response: any) => response.data || [],
    }),
    getAdminUserAuditData: builder.query<any, { userId: string; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin-reports/audit-data',
        params
      }),
    }),
    getAdminPayrollOverview: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/payroll/admin-overview',
        params,
      }),
    }),
    getAdminPayrollList: builder.query<any[], void>({
      query: () => '/payroll/admin-list',
      transformResponse: (response: any) => response.data || [],
    }),
    getLiveFleet: builder.query<any[], void>({
      query: () => '/users/live-fleet',
      transformResponse: (response: any) => response.data || [],
      providesTags: ['User'],
    }),
    toggleUserStatus: builder.mutation<any, { userId: string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `/users/toggle-status/${userId}`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetHierarchyQuery, 
  useCreateUserMutation,
  useGetMyTeamQuery,
  useGetProfileStatsQuery,
  useGetAdminExpenseOverviewQuery,
  useGetAdminRecentClaimsQuery,
  useGetAdminUserAuditDataQuery,
  useGetAdminPayrollOverviewQuery,
  useGetAdminPayrollListQuery,
  useGetLiveFleetQuery,
  useToggleUserStatusMutation
} = userApi;
