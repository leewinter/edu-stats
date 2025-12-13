using FluentValidation;

namespace EduStats.Application.Enrollments.Commands.DropStudentEnrollment;

public sealed class DropStudentEnrollmentCommandValidator : AbstractValidator<DropStudentEnrollmentCommand>
{
    public DropStudentEnrollmentCommandValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.EnrollmentId).NotEmpty();
    }
}
