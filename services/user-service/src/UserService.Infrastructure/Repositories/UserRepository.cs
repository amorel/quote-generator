using Microsoft.EntityFrameworkCore;
using UserService.Core.Domain.Entities;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Data;

namespace UserService.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddFavoriteQuoteAsync(Guid userId, string quoteId)
        {
            var user = await GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException($"User with id {userId} not found");

            // Supposons que nous avons une table FavoriteQuotes ou une collection
            var favoriteQuote = new FavoriteQuote
            {
                UserId = userId,
                QuoteId = quoteId,
                CreatedAt = DateTime.UtcNow
            };

            _context.FavoriteQuotes.Add(favoriteQuote);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFavoriteQuoteAsync(Guid userId, string quoteId)
        {
            var favoriteQuote = await _context.FavoriteQuotes
                .FirstOrDefaultAsync(f => f.UserId == userId && f.QuoteId == quoteId);

            if (favoriteQuote != null)
            {
                _context.FavoriteQuotes.Remove(favoriteQuote);
                await _context.SaveChangesAsync();
            }
        }
    }
}