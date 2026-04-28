import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: '/admin/dashboard',
        params: { startDate, endDate },
      }),
      providesTags: ['Dashboard'],
    }),
    exportDashboard: builder.mutation<void, string>({
      query: (type) => ({
        url: '/admin/dashboard/export',
        method: 'GET',
        responseHandler: async (response: Response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report-${type}-${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery, useExportDashboardMutation } = dashboardApi;
