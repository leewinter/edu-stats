using FluentValidation;

namespace EduStats.Application.Enrollments.Commands.EnrollStudentInCourse;

public sealed class EnrollStudentInCourseCommandValidator : AbstractValidator<EnrollStudentInCourseCommand>
{
    public EnrollStudentInCourseCommandValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.CourseId).NotEmpty();
    }
}
