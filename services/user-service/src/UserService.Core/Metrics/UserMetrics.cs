using Prometheus;

namespace UserService.Core.Metrics
{
    public static class UserMetrics
    {
        private static readonly Counter _usersCreatedTotal = Prometheus.Metrics
            .CreateCounter("users_created_total", "Total number of users created");

        private static readonly Counter _userFavoritesTotal = Prometheus.Metrics
            .CreateCounter("user_favorites_total", "Total number of favorites added");

        private static readonly Gauge _activeUsersGauge = Prometheus.Metrics
            .CreateGauge("active_users_total", "Total number of active users");

        private static readonly Histogram _userOperationDuration = Prometheus.Metrics
            .CreateHistogram("user_operation_duration_seconds", 
                "Histogram of user operation durations",
                new HistogramConfiguration
                {
                    Buckets = new[] { .005, .01, .025, .05, .075, .1, .25, .5, .75, 1 }
                });

        // Accesseurs publics
        public static Counter UsersCreatedTotal => _usersCreatedTotal;
        public static Counter UserFavoritesTotal => _userFavoritesTotal;
        public static Gauge ActiveUsersGauge => _activeUsersGauge;
        public static Histogram UserOperationDuration => _userOperationDuration;
    }
}