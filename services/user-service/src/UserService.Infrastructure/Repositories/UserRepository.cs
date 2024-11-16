using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UserService.Core.Domain.Entities;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Data;

namespace UserService.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(
            ApplicationDbContext context,
            ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User?> GetByIdAsync(string id)
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

        public async Task DeleteAsync(string id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddFavoriteQuoteAsync(string userId, string quoteId)
        {
            try
            {
                _logger.LogInformation("[REPOSITORY] Adding favorite quote. UserId: {UserId}, QuoteId: {QuoteId}",
                    userId, quoteId);

                // Vérifier d'abord si l'utilisateur existe
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new InvalidOperationException($"User with ID {userId} not found");
                }

                // Vérifier si le favori existe déjà
                var existingFavorite = await _context.FavoriteQuotes
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.QuoteId == quoteId);

                if (existingFavorite != null)
                {
                    return; // Le favori existe déjà
                }

                var favoriteQuote = new FavoriteQuote
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    QuoteId = quoteId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.FavoriteQuotes.Add(favoriteQuote);
                var result = await _context.SaveChangesAsync();

                _logger.LogInformation("[REPOSITORY] SaveChanges result: {Result}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[REPOSITORY] Error adding favorite quote");
                throw;
            }
        }

        public async Task RemoveFavoriteQuoteAsync(string userId, string quoteId)
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