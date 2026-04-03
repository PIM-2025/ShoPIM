using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Models;
using ShoPIM.Data;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            
            return await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Contacts)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(long id)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Contacts)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            return user;
        }

        
        [HttpPost]
        public async Task<ActionResult<Users>> PostUser(Users user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
    }
}