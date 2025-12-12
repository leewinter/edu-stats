namespace EduStats.Application.Common.Models;

public sealed class PaginationRequest
{
    private int _pageNumber = 1;
    private int _pageSize = 50;

    public int PageNumber
    {
        get => _pageNumber;
        init => _pageNumber = Math.Max(1, value);
    }

    public int PageSize
    {
        get => _pageSize;
        init => _pageSize = Math.Clamp(value, 1, 500);
    }
}
